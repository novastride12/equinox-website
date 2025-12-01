import SectionHeader from "../components/SectionHeader";
import gallery from "../data/gallery.json";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
}

const Gallery = () => {
  const items = gallery as GalleryItem[];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <SectionHeader
        title="Gallery"
        subtitle="Snapshots from launches, workshops and observation nights."
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <figure
            key={item.id}
            className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 md:h-48 object-cover"
            />
            <figcaption className="p-2 text-xs text-slate-300">
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
