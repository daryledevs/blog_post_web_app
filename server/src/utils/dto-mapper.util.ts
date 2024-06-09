import dtoMap               from "@/constants/dto-map.constants";
import { ClassConstructor } from "class-transformer";

const dtoMapper = (
  endpoint: string | undefined
): ClassConstructor<any> | undefined => {
  const path1 = endpoint?.split("/");
  const resource = path1?.[3];
  const operation = path1?.[4];

  if (resource && operation) {
    return dtoMap[resource][operation];
  }

  return undefined;
};

export default dtoMapper;
