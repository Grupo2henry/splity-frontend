import GroupBalance from '../GroupBalance';

interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { // Next.js espera esta propiedad opcional
    [key: string]: string | string[] | undefined;
  };
}

const GroupBalancePage = async ({ params }: PageProps) => {
  return <GroupBalance groupId={params.id} />;
};

export default GroupBalancePage;