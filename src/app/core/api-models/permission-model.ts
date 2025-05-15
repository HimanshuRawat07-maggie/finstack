export interface UserPermissions {
    userId: number;
    permissions: any | Permission;
}

export interface Permission {
    'dashboard'?: PermissionValue;
    'company'?: PermissionValue;
    'item'?: PermissionValue;
    'service'?: PermissionValue;
    'item group'?: PermissionValue;
    'warehouse'?: PermissionValue;
    'party'?: PermissionValue;
    'bank'?: PermissionValue;
    'sale order'?: PermissionValue;
    'challan out'?: PermissionValue;
    'challan in'?: PermissionValue;
    'sale asstes'?: PermissionValue;
    'purchase assets'?: PermissionValue;
    'sale invoice'?: PermissionValue;
    'tax invoice'?: PermissionValue;
    'pos invoice'?: PermissionValue;
    'service invoice'?: PermissionValue;
    'export invoice'?: PermissionValue;
    'credit note'?: PermissionValue;
    'purchase order'?: PermissionValue;
    'purchase bills'?: PermissionValue;
    'debit note'?: PermissionValue;
    'payment in'?: PermissionValue;
    'payment out'?: PermissionValue;
    'journal'?: PermissionValue;
    'master group'?: PermissionValue;
    'ledger'?: PermissionValue;
    // 'report'?: PermissionValue;
    'financial statements report'?: PermissionValue;
    'accounts report'?: PermissionValue;
    'outstanding management report'?: PermissionValue;
    'stock report'?: PermissionValue;
    'statutory report'?: PermissionValue;
    'company settings'?: PermissionValue;
}

export interface PermissionValue {
    canCreate?: boolean;
    canView?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canShare?: boolean;
}

export interface UserGroupPermissions {
    userId: number;
    permissions: any;
}