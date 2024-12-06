import torch.nn as nn
import torch

def vae_loss(reconstructed, input_data, mu, log_var):
    # 재구성 손실 (Binary Cross-Entropy)
    reconstruction_loss = nn.functional.binary_cross_entropy(reconstructed, input_data, reduction="sum")
    # KL 발산 손실
    kl_divergence = -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp())
    # 총 손실
    return reconstruction_loss + kl_divergence
