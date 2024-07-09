import dtoMap               from "@/constants/dto-map.constants";
import { ClassConstructor } from "class-transformer";

const dtoMapper = (
  endpoint: string | undefined
): ClassConstructor<any> | undefined => {
  const path = endpoint?.split("/");
  const resource = path?.[3];
  let operation = path?.[4];

  if (!isNaN(Number(operation))) {
    operation = path?.[5];
  }

  if (
    resource &&
    operation &&
    dtoMap[resource] &&
    dtoMap[resource][operation]
  ) {
    return dtoMap[resource][operation];
  }

  return undefined;
};

export default dtoMapper;
