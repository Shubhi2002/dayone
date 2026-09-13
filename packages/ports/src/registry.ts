import type { ProviderDescriptor } from "./descriptor.js";

/** Generic registry so use cases look providers up by id and capabilities, never by import. */
export class ProviderRegistry<Id extends string, P extends { descriptor: ProviderDescriptor<Id, unknown> }> {
  private readonly items = new Map<Id, P>();
  register(provider: P): this {
    if (this.items.has(provider.descriptor.id)) throw new Error(`Provider already registered: ${provider.descriptor.id}`);
    this.items.set(provider.descriptor.id, provider);
    return this;
  }
  get(id: Id): P {
    const p = this.items.get(id);
    if (!p) throw new Error(`Unknown provider: ${id}`);
    return p;
  }
  has(id: Id): boolean { return this.items.has(id); }
  list(): P[] { return [...this.items.values()]; }
  ids(): Id[] { return [...this.items.keys()]; }
}
