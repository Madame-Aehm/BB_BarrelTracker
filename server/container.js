import CacheService from "./services/cacheService.js";
import EmailService from "./services/emailService.js";
import CloudinaryService from "./services/cloudinaryService.js";
import { barrelRepository } from "./repositories/barrelRepository.js";
import { customerRepository } from "./repositories/customerRepository.js";
import { authRepository } from "./repositories/authRepository.js";
import { sessionRepository } from "./repositories/sessionRepository.js";
import BarrelService from "./services/barrelService.js";
import CustomerService from "./services/customerService.js";
import AuthService from "./services/authService.js";

export function createContainer() {
  const cacheService = new CacheService();
  const emailService = new EmailService();
  const cloudinaryService = new CloudinaryService();

  const barrelService = new BarrelService({
    barrelRepository,
    cloudinaryService,
    emailService,
  });

  const customerService = new CustomerService({
    customerRepository,
    cacheService,
  });

  const authService = new AuthService({
    authRepository,
    sessionRepository,
    emailService,
  });

  return {
    cacheService,
    emailService,
    cloudinaryService,
    barrelRepository,
    customerRepository,
    authRepository,
    sessionRepository,
    barrelService,
    customerService,
    authService,
  };
}

let containerInstance;

export function getContainer() {
  if (!containerInstance) {
    containerInstance = createContainer();
  }
  return containerInstance;
}
