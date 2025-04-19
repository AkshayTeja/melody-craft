import { type LucideIcon } from "lucide-react";
import { Session } from "next-auth";

export interface UserModel {
	id: string;
	name: string;
	email: string;
	email_verified: Date | null;
	image: string;
	created_at: Date;
	updated_at: Date;
}

export interface AccountModel {
	user_id: string;
	provider_id: string;
	provider_type: string;
	provider_account_id: string;
	refresh_token: string;
	access_token: string;
	expires_at: Date | null;
	token_type: string;
	scope: string;
	id_token: string;
	session_state: string;
}

export interface VerificationTokenModel {
	identifier: string;
	token: string;
	expires: Date;
}

export interface SessionModel {
	id: number;
	expires: Date;
	session_token: string;
	user_id: string;
}

export interface UserSessionModel extends Session {
	user: UserModel & { emailVerified: boolean };
	expires: string;
}
