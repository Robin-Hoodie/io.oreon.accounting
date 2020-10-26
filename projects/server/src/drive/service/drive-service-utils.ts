export const addParentFolderIdToQuery = (q: string, parentFolderId: string) => {
  return `${q} and '${parentFolderId}' in parents`;
};
