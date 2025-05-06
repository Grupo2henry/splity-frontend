'use client';

import { Suspense } from 'react';
import Success from './Success';

export default function SuccessPage() {
  return (
    <Suspense fallback={<p>Cargando información del pago...</p>}>
      <Success />
    </Suspense>
  );
}
