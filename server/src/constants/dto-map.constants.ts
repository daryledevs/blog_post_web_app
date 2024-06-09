import UserDto from "@/dto/user.dto";

const dtoMap: { [key: string]: any | undefined } = {
  auth: {
    register: UserDto,
  },
};

export default dtoMap;