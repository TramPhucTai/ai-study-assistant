const getInitials = (name) => {
  if (!name || !name.trim()) return "";

  const nameParts = name.trim().split(/\s+/);

  if (nameParts.length === 1) {
    return nameParts[0][0].toUpperCase();
  }

  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts[nameParts.length - 1][0];

  return `${firstInitial}${lastInitial}`.toUpperCase();
};

export default getInitials;