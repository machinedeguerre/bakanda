const isValidDomainSyntax = (domain: string) => {
  return /^[A-Za-z0-9-]{1,63}\.[A-Za-z]{2,6}$/.test(domain);
};

const lookupDomain = async (domain: string) => {
  if (!isValidDomainSyntax(domain)) {
    return [];
  }

  const url = `https://dns.google/resolve?name=${domain}&type=A`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Answer && data.Answer.length > 0) {
      const ips: string[] = data.Answer.map((record: any) => record.data);
      return ips;
    } else {
      return [];
    }
  } catch (error) {
    return [];
  }
};

export { lookupDomain };
