import * as CounterActions from './counter';
import * as UserActions from './user';
import * as EventActions from './event';
import * as ActiveEventActions from './activeEvent';
import * as SuggestionActions from './suggestion';
import * as SuggestedActivityActions from './suggestedActivity';
import * as InvitedFriendsActions from './invitedFriends';
import * as createdEventsActions from './createdEvents';
import * as ActivitiesActions from './activities';

export const ActionCreators = Object.assign({}, CounterActions, UserActions, EventActions,
SuggestionActions, ActiveEventActions,
SuggestedActivityActions,
InvitedFriendsActions,
createdEventsActions,
ActivitiesActions,
);
