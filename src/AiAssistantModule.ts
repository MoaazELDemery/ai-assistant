import { NativeModule, requireNativeModule } from 'expo';

import { AiAssistantModuleEvents } from './AiAssistant.types';

declare class AiAssistantModule extends NativeModule<AiAssistantModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<AiAssistantModule>('AiAssistant');
