import { Injectable } from '@nestjs/common';
import { validateCoordinates, validateAccuracy, calculateDistance } from '@mas/lib';

@Injectable()
export class LocationService {
  private readonly configuredLocations = [
    { name: 'Base A', lat: 6.2088, lng: 106.8456, radius: 50 }, // Jakarta
    { name: 'Base B', lat: -6.914744, lng: 107.609810, radius: 50 }, // Bandung
  ];

  async validateLocation(dto: { latitude: number; longitude: number; accuracy: number }) {
    if (!validateCoordinates(dto.latitude, dto.longitude)) {
      return { valid: false, reason: 'Invalid coordinates' };
    }

    if (!validateAccuracy(dto.accuracy)) {
      return { valid: false, reason: 'Invalid accuracy value' };
    }

    // Check if location is within allowed radius
    const isWithinRadius = this.configuredLocations.some((location) => {
      const distance = calculateDistance(
        dto.latitude,
        dto.longitude,
        location.lat,
        location.lng,
      );
      return distance <= location.radius;
    });

    return {
      valid: isWithinRadius,
      reason: isWithinRadius ? 'Location valid' : 'Location outside allowed radius',
    };
  }
}
