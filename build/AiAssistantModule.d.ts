import { NativeModule } from 'expo';
import { AiAssistantModuleEvents } from './AiAssistant.types';
declare class AiAssistantModule extends NativeModule<AiAssistantModuleEvents> {
    PI: number;
    hello(): string;
    setValueAsync(value: string): Promise<void>;
}
declare const _default: AiAssistantModule;
export default _default;
//# sourceMappingURL=AiAssistantModule.d.ts.map