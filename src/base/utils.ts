export const randomElement = <T>(array: T[]): T => {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
};

export async function getResponseData(url: string): Promise<unknown> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('response not OK');
  }

  return await response.json();
}
