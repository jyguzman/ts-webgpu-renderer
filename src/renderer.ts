export class Renderer {

    async initWebGPU() {
        if (!navigator.gpu) {
            throw new Error("WebGPU is not supported on this browser.");
            return null;
          }
        
          const adapter = await navigator.gpu.requestAdapter();
          if (!adapter) {
              throw new Error("Could not request WebGPU adapter.");
              return null;
          }
      
          const device = await adapter.requestDevice();
          const canvas = document.querySelector("canvas") as HTMLCanvasElement;
          const context = canvas.getContext("webgpu") as GPUCanvasContext;
      
          const format = navigator.gpu.getPreferredCanvasFormat();
          context.configure({
              device,
              format: format,
              alphaMode: 'opaque'
          });
      
          return {device, format, context};
    }
}

export async function initWebGPU() {
    if (!navigator.gpu) {
      throw new Error("WebGPU is not supported on this browser.");
      return null;
    }
  
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error("Could not request WebGPU adapter.");
        return null;
    }

    const device = await adapter.requestDevice();
    const canvas = document.querySelector("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("webgpu") as GPUCanvasContext;

    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: format,
        alphaMode: 'opaque'
    });

    return {device, format, context};
  }