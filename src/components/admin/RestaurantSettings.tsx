import { useMenu } from '../../context/MenuContext';
import { Input, Textarea } from '../ui/Input';
import { ImageUpload } from '../ui/ImageUpload';

export function RestaurantSettings() {
  const { state, dispatch } = useMenu();
  const info = state.restaurantInfo;

  const update = (field: string, value: string | undefined) => {
    dispatch({ type: 'SET_RESTAURANT_INFO', payload: { [field]: value } });
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <h2 className="text-2xl font-heading font-bold text-text-main mb-6">Restaurant Settings</h2>

      <div className="space-y-6">
        <section className="bg-surface rounded-card p-5 border border-black/5 space-y-4">
          <h3 className="font-semibold text-text-main">Basic Info</h3>
          <Input
            label="Restaurant Name"
            value={info.name}
            onChange={e => update('name', e.target.value)}
          />
          <Textarea
            label="Tagline / Description"
            value={info.tagline}
            onChange={e => update('tagline', e.target.value)}
            rows={2}
          />
        </section>

        <section className="bg-surface rounded-card p-5 border border-black/5 space-y-4">
          <h3 className="font-semibold text-text-main">Contact & Hours</h3>
          <Input
            label="Phone Number"
            value={info.phone ?? ''}
            onChange={e => update('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
          <Input
            label="Address"
            value={info.address ?? ''}
            onChange={e => update('address', e.target.value)}
            placeholder="123 Main St, City, State"
          />
          <Input
            label="Website"
            type="url"
            value={info.website ?? ''}
            onChange={e => update('website', e.target.value)}
            placeholder="https://yourrestaurant.com"
          />
          <Input
            label="Opening Hours"
            value={info.openingHours ?? ''}
            onChange={e => update('openingHours', e.target.value)}
            placeholder="Mon–Sun: 11am – 10pm"
          />
        </section>

        <section className="bg-surface rounded-card p-5 border border-black/5 space-y-4">
          <h3 className="font-semibold text-text-main">Logo</h3>
          <ImageUpload
            value={info.logoBase64}
            onChange={val => update('logoBase64', val)}
            label="Logo (shown in menu header)"
          />
        </section>

        <section className="bg-surface rounded-card p-5 border border-black/5 space-y-4">
          <h3 className="font-semibold text-text-main">Cover Image</h3>
          <ImageUpload
            value={info.coverImageBase64}
            onChange={val => update('coverImageBase64', val)}
            label="Cover / Hero image"
          />
        </section>
      </div>
    </div>
  );
}
