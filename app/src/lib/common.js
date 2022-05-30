export function share(data) {
  if (navigator.share) {
    navigator
      .share(data)
      .then(() => console.log('Successful share'))
      .catch((error) => console.error('Error sharing', error));
  }
}
