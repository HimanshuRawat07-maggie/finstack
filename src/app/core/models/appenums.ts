/*
Enum: AppEvents
Purpose: Defines all the possible application event Ids that can be sent to a parent component
Notes: Use events when a child component needs to let parent(s) components know of an event
        and a data payload can also be passed with the event.
*/

export enum AppEvents {
    UnKnown = 0,
    LoggedIn,
    SetUser,
    Processing,
    ShowToast,
    AddAlert,
    RemoveAlert,
    ValidationErrors,
    ClearAll,
    WatchForm,
    SetFormDirty,
    PristineForm,
    SidebarToggle,
    SetUserPermission,
    SetCompany,
    UpdateCompanySettings,
    SetSubscriptionStatus,
    SetSubscriptionEndDate
}