import torch
import torch.nn as nn

class ConvVAE50x50(nn.Module):
    def __init__(self, input_channels=1, latent_dim=10):
        super(ConvVAE50x50, self).__init__()
        # 인코더
        self.encoder = nn.Sequential(
            nn.Conv2d(input_channels, 16, kernel_size=4, stride=2, padding=1),  # (16, 250, 250)
            nn.ReLU(),
            nn.Conv2d(16, 32, kernel_size=4, stride=2, padding=1),              # (32, 125, 125)
            nn.ReLU(),
            nn.Conv2d(32, 64, kernel_size=4, stride=2, padding=1),              # (64, 63, 63)
            nn.ReLU(),
            nn.Conv2d(64, 128, kernel_size=4, stride=2, padding=1),             # (128, 32, 32)
            nn.ReLU(),
            nn.Conv2d(128, 256, kernel_size=4, stride=2, padding=1),            # (256, 16, 16)
            nn.ReLU(),
            nn.Conv2d(256, 512, kernel_size=4, stride=2, padding=1)             # (512, 8, 8)
        )

        # 잠재 공간으로 매핑
        # fc_mu와 fc_logvar의 입력 크기를 인코더 출력 크기에 맞게 설정
        self.fc_mu = nn.Linear(512 * 7 * 7, latent_dim)
        self.fc_logvar = nn.Linear(512 * 7 * 7, latent_dim)



        # 디코더
        # fc_decode에서 디코더 입력 크기를 정확히 설정
        self.fc_decode = nn.Linear(latent_dim, 512 * 7 * 7)

        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(512, 256, kernel_size=4, stride=2, padding=1),  # (256, 14, 14)
            nn.ReLU(),
            nn.ConvTranspose2d(256, 128, kernel_size=4, stride=2, padding=1),  # (128, 28, 28)
            nn.ReLU(),
            nn.ConvTranspose2d(128, 64, kernel_size=4, stride=2, padding=1),   # (64, 56, 56)
            nn.ReLU(),
            nn.ConvTranspose2d(64, 32, kernel_size=4, stride=2, padding=1),    # (32, 112, 112)
            nn.ReLU(),
            nn.ConvTranspose2d(32, 16, kernel_size=4, stride=2, padding=1),    # (16, 224, 224)
            nn.ReLU(),
            nn.Upsample(size=(500, 500), mode='bilinear', align_corners=False), # (16, 500, 500)
            nn.Conv2d(16, input_channels, kernel_size=3, padding=1),           # (1, 500, 500)
            nn.Sigmoid()  # [0, 1] 범위로 값 제한
        )





    def encode(self, x):
        h = self.encoder(x)
        h = h.view(h.size(0), -1)  # 평탄화
        mu = self.fc_mu(h)
        log_var = self.fc_logvar(h)
        return mu, log_var

    def reparameterize(self, mu, log_var):
        std = torch.exp(0.5 * log_var)
        epsilon = torch.randn_like(std)
        return mu + epsilon * std

    def decode(self, z):
        h = self.fc_decode(z)
        h = h.view(-1, 512, 7, 7)  # 디코더 입력 크기로 변환    
        return self.decoder(h)

    def forward(self, x):
        mu, log_var = self.encode(x)
        z = self.reparameterize(mu, log_var)
        reconstructed = self.decode(z)
        
        return reconstructed, mu, log_var
