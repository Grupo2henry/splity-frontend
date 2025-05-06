'use client';

import BalanceBoard from '@/components/Balance_Board/Balance_Board';
import { useEffect } from 'react';

interface Props {
  groupId: string;
}

const GroupBalance = ({ groupId }: Props) => {
  useEffect(() => {
    localStorage.setItem('currentGroupId', groupId); // si necesitás guardarlo
  }, [groupId]);

  return (
    <div className="p-4">
      <BalanceBoard groupId={groupId} />
    </div>
  );
};

export default GroupBalance;
