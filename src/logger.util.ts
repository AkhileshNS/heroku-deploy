export const running = (action: string) => 
  console.log(`⌛ STEP: ${action}`);
  
export const success = (action: string) => 
  console.log(`✔️ STEP: ${action} - Success`)

export const failure = (action: string) => 
  console.log(`❌ STEP: ${action} - Failure`)