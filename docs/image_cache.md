## Image cache

Whenever the app needs to download a new image from an url it caches the image data and never downloads again. The whole process is managed by `imageCache` module which can be found inside `components` directory. The module exports an `ImageCache` component to be used in following pattern.

```
<ImageCache
  uri={image_url}
  style={custom_style_object}
  transportType={transport_type}
/>
```
**uri (required):** Image url from where the image will be downloaded.

**style (required):** A react-native style object.

**transportType (required):** Transport type `(flight/bus)` of the trip. This is used to show the respective placeholder image in case the actual image download fails.


### Workflow

`imageCache` is the object in redux store where image information are stored and actual image is stored in the file system document directory. The file system path is
```
const BASE_DIR = FileSystem.documentDirectory
const IMAGE_CACHE_DIR = `${BASE_DIR}imageCache/`
```

Path of a particular image is:
```
`${IMAGE_CACHE_DIR}${<image_url_hash>}`
```


```
imageCache: {
  <image_hash>: {
    loading: true/false,
    sucs: 'true/false
  }
}
```

- when the `ImageCache` component is mounted it converts the image url to a hash and looks for the image data in store. If data is not in cache or previous download attempt is failed then a new download is initiated.

- The image download action first checks if the image data is already downloaded and stored in the image directory of the file system. If yes then just a new entry is created in redux store `imageCache` object or if no then the image is downloaded, stored in file system and then a new entry is created in redux store `imageCache` object.

- Lastly the respective `ImageCache` component is notified about a successful image download, since it is a connected component and prepares the path for the react-native `Image` component to show the image.

- While `loading: true` the `ImageCache` component shows a generic placeholder image and while `sucs: false` it shows a placeholder image based on the transport type of the trip.


Before all the above steps during the application start-up phase an action is dispatched to create the image cache directory. The action is dispatched from the `LoadingScreen` component inside `auth` module (filename is `loadingScreen.js`). It dispatches the following action

```
this.props.dispatch(createCacheDir())
```
This action creates a directory to store downloaded image data in the following path if it does not exist already.

Image cache directory path:
```
const BASE_DIR = FileSystem.documentDirectory
const IMAGE_CACHE_DIR = `${BASE_DIR}imageCache/`
```