const isPublicIP = (ip: string) => {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
  if (!ipv4Regex.test(ip)) return false;

  const [first, second] = ip.split(".").map(Number);

  const privateRanges = [
    [10, 0, 0, 0, 10, 255, 255, 255], // 10.0.0.0 - 10.255.255.255
    [172, 16, 0, 0, 172, 31, 255, 255], // 172.16.0.0 - 172.31.255.255
    [192, 168, 0, 0, 192, 168, 255, 255], // 192.168.0.0 - 192.168.255.255
  ];

  for (const [start1, start2, , , end1, end2] of privateRanges) {
    if (
      first >= start1 &&
      first <= end1 &&
      second >= start2 &&
      second <= end2
    ) {
      return false;
    }
  }

  if (first === 127 || (first >= 224 && first <= 239)) {
    return false;
  }

  return true;
};

export { isPublicIP };
