import { DataTypes, Sequelize, Model } from "sequelize";
import { Connection } from "../db/connection";
import VideosModel from "./videos";

type includes = 'has_video';

const UsersModel = (include?: (includes)[]) => {
	const model = (Connection.getInstance().db as Sequelize).define<Model<IUsers>>('users', {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING,
			unique: true
		},
		password: {
			type: DataTypes.STRING
		},
		name: {
			type: DataTypes.STRING
		},
		phone: {
			type: DataTypes.STRING(20)
		},
		created_at: {
			type: DataTypes.STRING
		},
		updated_at: {
			type: DataTypes.STRING
		}
	}, { tableName: 'users' });

	if (include && include.includes('has_video')) {
		model.hasMany(VideosModel(), {
			sourceKey: 'id',
			foreignKey: 'user_id',
		});
		VideosModel().belongsTo(model);
	}

	return model;
}

export class UserRelations {
	public static exclude = [
		'password',
		'created_at',
		'updated_at',
	];
}

export interface IUsers {
	id?: number,
	email?: string,
	name?: string,
	password?: string,
	phone?: string,
	updated_at?: string,
	created_at?: string,
}

export default UsersModel;