
export const randomAvatar = async (firstName, lastName) => {
    return `https://api.dicebear.com/6.x/avataaars/svg?seed=${firstName}${lastName}`;
  };

