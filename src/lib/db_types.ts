export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      countries: {
        Row: {
          continent: Database["public"]["Enums"]["continents"] | null
          id: number
          iso2: string
          iso3: string | null
          local_name: string | null
          name: string | null
        }
        Insert: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2: string
          iso3?: string | null
          local_name?: string | null
          name?: string | null
        }
        Update: {
          continent?: Database["public"]["Enums"]["continents"] | null
          id?: number
          iso2?: string
          iso3?: string | null
          local_name?: string | null
          name?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          end_at: string | null
          id: string
          name: string
          places: number
          spot_id: string
          start_at: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          end_at?: string | null
          id?: string
          name: string
          places?: number
          spot_id: string
          start_at: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          end_at?: string | null
          id?: string
          name?: string
          places?: number
          spot_id?: string
          start_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spot_extended_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spot_search_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spots"
            referencedColumns: ["id"]
          }
        ]
      }
      events_invitations: {
        Row: {
          created_at: string | null
          event_id: string
          event_participation_id: string | null
          id: string
          status: Database["public"]["Enums"]["invitation_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          event_participation_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invitation_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          event_participation_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invitation_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_extanded_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_search_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_invitations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_invitations_event_participation_id_fkey"
            columns: ["event_participation_id"]
            isOneToOne: false
            referencedRelation: "events_participations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_invitations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      events_participations: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          status: Database["public"]["Enums"]["invitation_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          status?: Database["public"]["Enums"]["invitation_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          status?: Database["public"]["Enums"]["invitation_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_extanded_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_search_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          creator_user_id: string
          first_user_id: string
          id: string
          second_user_id: string
          status: Database["public"]["Enums"]["invitation_status"]
        }
        Insert: {
          created_at?: string | null
          creator_user_id: string
          first_user_id: string
          id?: string
          second_user_id: string
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Update: {
          created_at?: string | null
          creator_user_id?: string
          first_user_id?: string
          id?: string
          second_user_id?: string
          status?: Database["public"]["Enums"]["invitation_status"]
        }
        Relationships: [
          {
            foreignKeyName: "friendships_creator_user_id_fkey"
            columns: ["creator_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_first_user_id_fkey"
            columns: ["first_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_second_user_id_fkey"
            columns: ["second_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      locations: {
        Row: {
          city: string | null
          country: number | null
          created_at: string | null
          department: string | null
          id: number
          latitude: number
          longitude: number
        }
        Insert: {
          city?: string | null
          country?: number | null
          created_at?: string | null
          department?: string | null
          id?: number
          latitude: number
          longitude: number
        }
        Update: {
          city?: string | null
          country?: number | null
          created_at?: string | null
          department?: string | null
          id?: number
          latitude?: number
          longitude?: number
        }
        Relationships: [
          {
            foreignKeyName: "locations_country_fkey"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_extanded_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event_search_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notification: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          subtitle: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          subtitle?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          subtitle?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          expo_push_id: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          expo_push_id?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          expo_push_id?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string | null
          creator_id: string
          id: string
          note: number | null
          spot_id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          creator_id: string
          id?: string
          note?: number | null
          spot_id: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          creator_id?: string
          id?: string
          note?: number | null
          spot_id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spot_extended_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spot_search_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spots"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews_likes: {
        Row: {
          created_at: string | null
          id: number
          profile_id: string
          review_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          profile_id: string
          review_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          profile_id?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "detailed_review"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews_with_like_count"
            referencedColumns: ["id"]
          }
        ]
      }
      spots: {
        Row: {
          approach: string | null
          cliff_height: number | null
          created_at: string | null
          creator: string
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"]
          id: string
          image: string[] | null
          location: number
          name: string
          orientation: Database["public"]["Enums"]["orientation"][] | null
          period: Database["public"]["Enums"]["month"][] | null
          rock_type: string | null
          slug: string | null
          type: Database["public"]["Enums"]["type"]
          updated_at: string | null
        }
        Insert: {
          approach?: string | null
          cliff_height?: number | null
          created_at?: string | null
          creator: string
          description?: string | null
          difficulty: Database["public"]["Enums"]["difficulty"]
          id?: string
          image?: string[] | null
          location: number
          name: string
          orientation?: Database["public"]["Enums"]["orientation"][] | null
          period?: Database["public"]["Enums"]["month"][] | null
          rock_type?: string | null
          slug?: string | null
          type: Database["public"]["Enums"]["type"]
          updated_at?: string | null
        }
        Update: {
          approach?: string | null
          cliff_height?: number | null
          created_at?: string | null
          creator?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"]
          id?: string
          image?: string[] | null
          location?: number
          name?: string
          orientation?: Database["public"]["Enums"]["orientation"][] | null
          period?: Database["public"]["Enums"]["month"][] | null
          rock_type?: string | null
          slug?: string | null
          type?: Database["public"]["Enums"]["type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spots_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spots_location_fkey"
            columns: ["location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spots_location_fkey"
            columns: ["location"]
            isOneToOne: false
            referencedRelation: "spot_search_view"
            referencedColumns: ["location_id"]
          }
        ]
      }
    }
    Views: {
      detailed_review: {
        Row: {
          content: string | null
          created_at: string | null
          creator_avatar_url: string | null
          creator_id: string | null
          id: string | null
          like_count: number | null
          note: number | null
          spot_id: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spot_extended_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spot_search_view"
            referencedColumns: ["id"]
          }
        ]
      }
      event_extanded_view: {
        Row: {
          created_at: string | null
          creator: Json | null
          end_at: string | null
          id: string | null
          name: string | null
          start_at: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      event_search_view: {
        Row: {
          city: string | null
          country: number | null
          department: string | null
          description: string | null
          id: string | null
          name: string | null
          places: number | null
          start_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_country_fkey"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews_with_like_count: {
        Row: {
          content: string | null
          created_at: string | null
          creator_id: string | null
          id: string | null
          like_count: number | null
          note: number | null
          request_user_liked: boolean | null
          spot_id: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spot_extended_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "spot_search_view"
            referencedColumns: ["id"]
          }
        ]
      }
      spot_extended_view: {
        Row: {
          approach: string | null
          cliff_height: number | null
          created_at: string | null
          creator: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          id: string | null
          image: string[] | null
          location: number | null
          name: string | null
          note: number | null
          orientation: Database["public"]["Enums"]["orientation"][] | null
          period: Database["public"]["Enums"]["month"][] | null
          rock_type: string | null
          slug: string | null
          type: Database["public"]["Enums"]["type"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "spots_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spots_location_fkey"
            columns: ["location"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "spots_location_fkey"
            columns: ["location"]
            isOneToOne: false
            referencedRelation: "spot_search_view"
            referencedColumns: ["location_id"]
          }
        ]
      }
      spot_search_view: {
        Row: {
          city: string | null
          country: number | null
          department: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          id: string | null
          image: string[] | null
          location_id: number | null
          name: string | null
          note: number | null
          slug: string | null
          type: Database["public"]["Enums"]["type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_country_fkey"
            columns: ["country"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      can_delete_event_participation: {
        Args: {
          p_user_id: string
          p_event_id: string
        }
        Returns: boolean
      }
      check_review_like: {
        Args: {
          user_id: number
          spot_id: number
        }
        Returns: boolean
      }
      generate_unique_slug: {
        Args: {
          base_slug: string
        }
        Returns: string
      }
      get_clusters: {
        Args: {
          min_latitude: number
          max_latitude: number
          min_longitude: number
          max_longitude: number
        }
        Returns: {
          result: Json
        }[]
      }
      get_spot_review_statistics: {
        Args: {
          spot_id: string
        }
        Returns: {
          total_reviews: number
          average_rating: number
          one_star_count: number
          two_star_count: number
          three_star_count: number
          four_star_count: number
          five_star_count: number
        }[]
      }
      get_user_conversations: {
        Args: {
          requested_user_id: string
        }
        Returns: {
          event_id: string
          event_name: string
          participants: Json
          last_message: Json
        }[]
      }
      get_user_review_statistics: {
        Args: {
          creator_id: string
        }
        Returns: {
          total_reviews: number
          average_rating: number
          one_star_count: number
          two_star_count: number
          three_star_count: number
          four_star_count: number
          five_star_count: number
        }[]
      }
      search_events: {
        Args: {
          keyword: string
        }
        Returns: {
          city: string | null
          country: number | null
          department: string | null
          description: string | null
          id: string | null
          name: string | null
          places: number | null
          start_at: string | null
        }[]
      }
      search_spots: {
        Args: {
          keyword: string
        }
        Returns: {
          city: string | null
          country: number | null
          department: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          id: string | null
          image: string[] | null
          location_id: number | null
          name: string | null
          note: number | null
          slug: string | null
          type: Database["public"]["Enums"]["type"] | null
        }[]
      }
      search_spots_within_bounds: {
        Args: {
          latitude_gte: number
          latitude_lte: number
          longitude_gte: number
          longitude_lte: number
        }
        Returns: {
          id: string
          name: string
          latitude: number
          longitude: number
        }[]
      }
      slugify: {
        Args: {
          value: string
        }
        Returns: string
      }
    }
    Enums: {
      continents:
        | "Africa"
        | "Antarctica"
        | "Asia"
        | "Europe"
        | "Oceania"
        | "North America"
        | "South America"
      difficulty: "Easy" | "Medium" | "Hard"
      diffulty: "Easy" | "Medium" | "Hard"
      invitation_status: "Pending" | "Accepted" | "Declined" | "Creator"
      month:
        | "January"
        | "February"
        | "March"
        | "April"
        | "May"
        | "June"
        | "July"
        | "August"
        | "September"
        | "October"
        | "November"
        | "December"
      orientation: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW"
      type: "Indoor" | "Outdoor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

