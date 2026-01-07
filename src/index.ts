// Reexport the native module. On web, it will be resolved to AiAssistantModule.web.ts
// and on native platforms to AiAssistantModule.ts
export { default } from './AiAssistantModule';
export { default as AiAssistantView } from './AiAssistantView';
export * from  './AiAssistant.types';
