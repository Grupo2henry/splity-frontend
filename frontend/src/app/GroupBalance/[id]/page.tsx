import GroupBalance from '../GroupBalance';

interface Props {
  params: {
    id: string;
  };
}

const GroupBalancePage = async ({ params }: Props) => {
  return <GroupBalance groupId={params.id} />;
};

export default GroupBalancePage;