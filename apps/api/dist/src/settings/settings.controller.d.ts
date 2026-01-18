import { UUID } from 'crypto';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    findByUserId(userId: UUID): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        currency: string;
        userId: string;
    }>;
    update(userId: UUID, payload: UpdateSettingsDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        currency: string;
        userId: string;
    }>;
}
