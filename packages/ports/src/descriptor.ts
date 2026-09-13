export interface ProviderDescriptor<Id extends string, Caps> {
  id: Id;
  displayName: string;
  capabilities: Caps;
}
