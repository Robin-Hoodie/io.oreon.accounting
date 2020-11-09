export const addParentFolderIdToQuery = (q: string, parentFolderId: string): string => {
  return `${q} and '${parentFolderId}' in parents`;
};
