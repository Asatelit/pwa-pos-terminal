export default function fetchImage(url: string, path: string) {
  return fetch(url + path).then(res => res);
}
