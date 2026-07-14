// class-name -> 真实素材路径（public/assets 下的文件，Vite 把 public 目录直接映射到网站根路径，
// 所以这里统一带前导斜杠）。查不到 key 时用 PH_SVG 生成一个内联占位图，不会 404。
export const IMGS = {
  'img-cellastar-main': '/assets/cellastar-shinjuku-reception.jpg',
  'img-cellastar-treatment': '/assets/cellastar-shinjuku-treatment.jpg',
  'img-cellastar-consult': '/assets/cellastar-shinjuku-consult.jpg',
  'img-utopiart-main': '/assets/utopiart-reception.jpg',
  'img-utopiart-treatment': '/assets/utopiart-treatment.jpg',
  'img-utopiart-room': '/assets/utopiart-room.jpg',
  'img-iena-lounge': '/assets/iena21-lounge.jpg',
  'img-iena-corridor': '/assets/iena21-corridor.jpg',
  'img-iena-treatment': '/assets/iena21-treatment.jpg',
  'img-iena-device': '/assets/iena21-device-treatment.jpg',
  'img-iena-injection': '/assets/iena21-injection.jpg',
  'img-lightmac-reception': '/assets/lightmac-reception.jpg',
  'img-lightmac-room': '/assets/lightmac-room-a.jpg',
  'img-lightmac-poster': '/assets/lightmac-reception.jpg',
  'img-hian-reception': '/assets/hian-macau-reception.jpg',
  'img-japan': '/assets/clinic-tokyo-a.jpg',
  'img-europe': '/assets/clinic-paris.jpg',
  'img-hk': '/assets/clinic-hongkong.jpg',
  'img-macau': '/assets/clinic-macau.jpg',
  'img-hero': '/assets/clinic-tokyo-a.jpg',
  'img-tokyo-a': '/assets/clinic-tokyo-a.jpg',
  'img-tokyo-b': '/assets/clinic-tokyo-b.jpg',
  'img-paris': '/assets/clinic-paris.jpg',
  'img-seoul': '/assets/clinic-seoul.jpg',
  'img-hongkong': '/assets/clinic-hongkong.jpg',
  'img-consult': '/assets/scene-consult.jpg',
  'img-iv': '/assets/scene-iv.jpg',
  'img-injection': '/assets/scene-injection.jpg',
  'img-device': '/assets/scene-device.jpg',
  'img-korea': '/assets/clinic-seoul.jpg',
  'img-newstar-real': '/assets/real-newstar.jpg',
  'img-lightmac-real': '/assets/real-lightmac.jpg',
  'img-device-real': '/assets/real-device.jpg',
  'img-paris-real': '/assets/real-paris.jpg',
};

export const PH_SVG = (label) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#E8EFEF"/><g fill="none" stroke="#7C9296" stroke-width="1" opacity=".45"><circle cx="200" cy="200" r="110"/><circle cx="200" cy="200" r="140"/></g><text x="200" y="207" font-family="Georgia,serif" font-size="22" letter-spacing="7" fill="#5F7377" fill-opacity=".8" text-anchor="middle">' +
      label +
      '</text></svg>'
  );

export const imgFor = (cls) => IMGS[cls] || PH_SVG('GOLONG');
