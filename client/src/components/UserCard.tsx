import type { UserDTO } from "../types";

interface Props {
  user: UserDTO;
}

export default function UserCard({ user }: Props) {
  const visibleHobbies = user.hobbies.slice(0, 2);
  const extraCount = user.hobbies.length - visibleHobbies.length;

  return (
    <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <img
        src={user.avatar}
        alt={`${user.first_name} ${user.last_name}`}
        className="w-14 h-14 rounded-full shrink-0 bg-gray-100"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-semibold text-gray-900 truncate">
            {user.first_name} {user.last_name}
          </span>
          <span className="text-sm text-gray-500 shrink-0">{user.age}y</span>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{user.nationality}</p>
        {user.hobbies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {visibleHobbies.map((hobby) => (
              <span
                key={hobby}
                className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5"
              >
                {hobby}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                +{extraCount}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
