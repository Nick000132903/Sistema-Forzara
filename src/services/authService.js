import { supabase } from "../lib/supabaseClient";

export const authService = {
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async updateDisplayName(displayName) {
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });
    if (error) throw error;
    return data;
  },

  async updateUserMetadata(metadata) {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });
    if (error) throw error;
    return data;
  },

  async getDisplayName() {
    const user = await this.getCurrentUser();
    return (
      user?.user_metadata?.display_name ||
      user?.email?.split("@")[0] ||
      "Usuário"
    );
  },

  async getRole() {
    const user = await this.getCurrentUser();
    return user?.user_metadata?.role || "Funcionário";
  },

  async resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/atualizar-senha`,
    });
    if (error) throw error;
    return data;
  },
};
