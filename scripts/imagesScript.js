const API_KEY = "cd4bdcfd2808af98a4feee11386a3010";
const ALBUMS = {
  test: "72177720307934040",
  a: "72177720307934480",
  "products-home": "72177720308173434",
};

export async function getImageData(album) {
  let albumId = ALBUMS[album];
  if (albumId === undefined) {
    console.error(
      "No associated id in remote server with provided album, please check the name:",
      album
    );
    return [];
  }
  let data = await fetchAlbumImagesData(albumId);
  return buildImagesData(data.photoset.photo);
}

function buildImagesData(photos) {
  let data = [];
  photos.forEach((photo) => {
    data.push({
      id: photo.id,
      url: buildImageUrl(photo),
      description: getDescription(photo),
    });
  });
  return data;
}

function getDescription(photo) {
  return photo?.description?._content;
}

function buildImageUrl(photo) {
  return `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
}

async function fetchAlbumImagesData(albumId) {
  let data = backupData(); // empty data (backup)
  await fetch(makeAlbumURL(albumId))
    .then((response) => response.json())
    .then((response) => (data = response))
    .catch((error) => {
      console.error(
        "Something went wrong while fetching photos for album:",
        albumId,
        "\n The error is:",
        error
      );
    });
  return data;
}

// for fallback
function backupData() {
  return {
    data: {
      photoset: {
        photo: [],
      },
    },
  };
}

function makeAlbumURL(albumId) {
  return `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${API_KEY}&photoset_id=${albumId}&format=json&nojsoncallback=1&extras=description`;
}
