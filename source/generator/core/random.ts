import llvm from "llvm-bindings";
import { LLVMFile } from "../file";
import { buildFunction } from "../function";
import { getPrimitive, Types } from "../primitive";

export function random(exporter: LLVMFile, importer: LLVMFile) {
  return () => {
    const rand = buildFunction("rand", getPrimitive(Types.Int32))(exporter);
    const template = buildFunction("_random", getPrimitive(Types.Int32));
    const fn = template(exporter);
    const entryBlock = llvm.BasicBlock.Create(exporter.context, "entry", fn);
    exporter.builder.SetInsertionPoint(entryBlock);
    const result = exporter.builder.CreateCall(rand, []);
    exporter.builder.CreateRet(result);
    if(!llvm.verifyFunction(fn)) {
      return {
        type: Types.Int32,
        value: template(importer)
      };
    } else {
      throw new Error("Function verification failed");
    }
  };
}
