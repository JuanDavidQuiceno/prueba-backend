import { DataTypes, Sequelize, Model } from "sequelize";
import { Connection } from "../db/connection";

type includes = '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VideosModel = (include?: (includes)[]) => {
	const model = (Connection.getInstance().db as Sequelize).define<Model<IVideos>>('videos', {
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			primaryKey: true
		},
		user_id: {
			type: DataTypes.INTEGER.UNSIGNED
		},
		title: {
			type: DataTypes.STRING
		},
		description: {
			type: DataTypes.TEXT
		},
		url: {
			type: DataTypes.TEXT
		},
		active: {
			type: DataTypes.BOOLEAN
		},
		created_at: {
			type: DataTypes.STRING
		},
		updated_at: {
			type: DataTypes.STRING
		},
	}, { tableName: 'videos' });

	// Ejemplo de uso de relacion entre 2 modelos (uno a uno)
	// if (include && include.includes('(tableInclude)')) {
	// 	model.hasOne(ModelTest(), {
	// 		sourceKey: 'keySource',
	// 		foreignKey: 'id',
	// 	});
	// 	ModelTest().belongsTo(model);
	// }

	return model;
}

export interface IVideos {
	id?: number,
	user_id?: number,
	title?: string,
	description?: string,
	url?: string,
	active?: boolean,
	created_at?: string,
	updated_at?: string,
}

export default VideosModel;