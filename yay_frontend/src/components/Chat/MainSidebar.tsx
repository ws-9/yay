import { useQuery } from '@tanstack/react-query';
import { API_MY_COMMUNITIES } from '../../constants';
import { useAuthActions, useToken } from '../../store/authStore';
import { Activity, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

type Community = {
  id: string;
  name: string;
  ownerId: number;
  ownerUsername: string;
  channels: Array<Channel>;
};

type Channel = {
  id: number;
  name: string;
  communityId: number;
};

export default function MainSidebar() {
  const token = useToken();
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery<Array<Community>>({
    queryKey: ['communities', 'my-communities'],
    queryFn: () => getMyCommunities(token),
  });

  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token]);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>error</div>;
  }

  const communityTabs = data?.map(community => (
    <CommunityTab
      key={community.id}
      name={community.name}
      channels={community.channels}
    />
  ));

  return (
    <div className="hidden flex-col justify-between border-r-2 sm:flex">
      <div>{communityTabs}</div>
      <button className="cursor-pointer" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

function CommunityTab({
  name,
  channels,
}: {
  name: string;
  channels: Array<Channel>;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer justify-between"
      >
        <h1>{name}</h1>
        <p>{expanded ? 'Less' : 'More'}</p>
      </button>
      <Activity mode={expanded ? 'visible' : 'hidden'}>
        {channels.map(channel => (
          <ChannelTab key={channel.id} name={channel.name} id={channel.id} />
        ))}
      </Activity>
    </div>
  );
}

function ChannelTab({ name, id }: { name: string; id: number }) {
  return (
    <div className="max-w-max cursor-pointer" onClick={() => console.log(id)}>
      - {name}
    </div>
  );
}

async function getMyCommunities(token: string | null) {
  const response = await fetch(API_MY_COMMUNITIES, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
