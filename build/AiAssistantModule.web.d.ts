import { NativeModule } from 'expo';
import { AiAssistantModuleEvents } from './AiAssistant.types';
declare class AiAssistantModule extends NativeModule<AiAssistantModuleEvents> {
    PI: number;
    setValueAsync(value: string): Promise<void>;
    hello(): string;
}
declare const _default: typeof AiAssistantModule;
export default _default;
//# sourceMappingURL=AiAssistantModule.web.d.ts.map