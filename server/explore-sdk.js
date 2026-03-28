import * as AlleSDK from "alle-ai-sdk";
console.log("AlleAI SDK Exports:", Object.keys(AlleSDK));
if (AlleSDK.default) {
  console.log("Default export type:", typeof AlleSDK.default);
  if (typeof AlleSDK.default === 'function' || typeof AlleSDK.default === 'object') {
    console.log("Default export keys:", Object.keys(AlleSDK.default));
  }
}
