import { initWebGPU } from "./renderer";

const triangle = /* wgsl */`
  struct OurVertexShaderOutput {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f,
  };

  @vertex fn vs(
    @builtin(vertex_index) vertexIndex : u32
  ) -> OurVertexShaderOutput {
    let pos = array(
      vec2f( 0.0,  0.5),  // top center
      vec2f(-0.5, -0.5),  // bottom left
      vec2f( 0.5, -0.5)   // bottom right
    );

    var color = array<vec4f, 3>(
      vec4f(1, 0, 0, 1), // red
      vec4f(0, 1, 0, 1), // green
      vec4f(0, 0, 1, 1), // blue
    );
    
    var vsOutput: OurVertexShaderOutput;
    vsOutput.position = vec4f(pos[vertexIndex], 0.0, 1.0);
    vsOutput.color = color[vertexIndex];
    return vsOutput;
  }


  @fragment fn fs(fsInput: OurVertexShaderOutput) -> @location(0) vec4f {
    return fsInput.color;
  }
  `

async function render() {
  const {device, format, context} = (await initWebGPU())!;
  
  const module = device.createShaderModule({
    label: "hardcoded shaders",
    code:  /* wgsl */`
      struct OurStruct {
        color: vec4f,
        scale: vec2f,
        offset: vec2f
      };

      @group(0) @binding(0) var<uniform> ourStruct: OurStruct;

      @vertex fn vs(
        @builtin(vertex_index) vertexIndex : u32
      ) -> @builtin(position) vec4f {
        let pos = array(
          vec2f( 0.0,  0.5),  // top center
          vec2f(-0.5, -0.5),  // bottom left
          vec2f( 0.5, -0.5)   // bottom right
        );
        
        return vec4f(
          pos[vertexIndex] * ourStruct.scale + ourStruct.offset, 0.0, 1.0
        );
      }

 
      @fragment fn fs() -> @location(0) vec4f { 
        return ourStruct.color;
      }
    `,
  })

  const pipeline = device.createRenderPipeline({
    label: "our pipeline",
    layout: "auto",
    vertex: {
      entryPoint: "vs",
      module,
    },
    fragment: {
      entryPoint: "fs",
      module,
      targets: [{ format: format }],
    },
  });

  const renderPassDescriptor: GPURenderPassDescriptor = {
    label: "render pass",
    colorAttachments: [
        {
            view: context.getCurrentTexture().createView(),
            clearValue: [0.3, 0.3, 0.3, 1],//{r: 0.3, b: 0.3, b: 0.3, a: 1.0},
            loadOp: "clear",
            storeOp: "store",
        },
    ],
  };

  const encoder = device.createCommandEncoder({label: "our encoder"});

  const pass = encoder.beginRenderPass(renderPassDescriptor);
  pass.setPipeline(pipeline);
  pass.draw(3);
  pass.end();

  const commandBuffer = encoder.finish();
  device.queue.submit([commandBuffer]);
  
}

render();

