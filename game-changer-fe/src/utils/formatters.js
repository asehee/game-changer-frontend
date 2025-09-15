export const formatAddress = (address, prefixLength = 6, suffixLength = 4) => {
    if (!address) return '';
    if (typeof address !== 'string') return '';
    if (address.length < prefixLength + suffixLength) return address;
    
    return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
  };