import type { UserRole } from '../../router';

export interface IUser {
  /**auto generated unique mongodb ObjectID/guid/cuid/suid/nanoid */
  _id: string;
  username: string;
  password: string;
  access_token: string;
  profile: string | IProfile;
  role: UserRole;
}

export interface IProfile {
  /**auto generated unique mongodb ObjectID/guid/cuid/suid/nanoid */
  _id: string;
  /** a title or name prefix */
  title: string;
  /** first name, also for given names for people from Asian cultures */
  fisrt_name: string;
  /** last name, also for family names for people from Asian cultures*/
  last_name: string;
  /** any other formal/informal names as per culture or region */
  other_names: Record<string, string>;
  /** date of birth as stated on an official document */
  dob: string | Date;
  /** physical gender of the person(not sexual orientation) */
  gender: 'male' | 'female';
  /** auto-generated meta */
  created_at: string | Date;
  /** auto-generated meta */
  updated_at: string | Date;
  /** auto-generated meta used for soft-deletes */
  deleted_at: string | Date;
}

export interface Trainnee extends IProfile {
  /**auto generated unique mongodb ObjectID/guid/cuid/suid/nanoid */
  application_id: string;
}
