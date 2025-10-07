import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import ky from 'ky';

const FormSchema = z.object({
  givenName: z.string().min(1),
  familyName: z.string().optional(),
  localScriptName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  sex: z.string().optional(),
  phone: z.string().optional(),
  language: z.string().optional(),
  originState: z.string().optional(),
  originDistrict: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  residenceAddress: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export function RegistrationForm() {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const payload: any = {
      name: {
        given: data.givenName,
        family: data.familyName || undefined,
        localScript: data.localScriptName || undefined,
      },
      dateOfBirth: data.dateOfBirth || undefined,
      sex: data.sex || undefined,
      phones: data.phone ? [data.phone] : undefined,
      languages: data.language ? [data.language] : undefined,
      origin: {
        state: data.originState || undefined,
        district: data.originDistrict || undefined,
      },
      occupation: data.occupation || undefined,
      employer: data.employer || undefined,
      residence: {
        address: data.residenceAddress || undefined,
        geo: (data.latitude && data.longitude) ? { lat: Number(data.latitude), lng: Number(data.longitude) } : undefined
      },
      consentGranted: true
    };

    await ky.post(`${backendUrl}/api/v1/migrants`, { json: payload }).json();
    alert(t('success_registered'));
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12 }}>
      <label>
        {t('given_name')}
        <input {...register('givenName')} />
      </label>
      <label>
        {t('family_name')}
        <input {...register('familyName')} />
      </label>
      <label>
        {t('local_script_name')}
        <input {...register('localScriptName')} />
      </label>
      <label>
        {t('dob')}
        <input type="date" {...register('dateOfBirth')} />
      </label>
      <label>
        {t('sex')}
        <select {...register('sex')}>
          <option value="">--</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label>
        {t('phone')}
        <input {...register('phone')} />
      </label>
      <label>
        {t('language')}
        <input {...register('language')} />
      </label>
      <label>
        {t('origin_state')}
        <input {...register('originState')} />
      </label>
      <label>
        {t('origin_district')}
        <input {...register('originDistrict')} />
      </label>
      <label>
        {t('occupation')}
        <input {...register('occupation')} />
      </label>
      <label>
        {t('employer')}
        <input {...register('employer')} />
      </label>
      <label>
        {t('residence_address')}
        <input {...register('residenceAddress')} />
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label>
          {t('latitude')}
          <input {...register('latitude')} />
        </label>
        <label>
          {t('longitude')}
          <input {...register('longitude')} />
        </label>
      </div>
      <button type="submit" disabled={isSubmitting}>{t('submit')}</button>
    </form>
  );
}
