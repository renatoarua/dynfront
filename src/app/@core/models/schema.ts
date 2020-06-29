import { schema } from 'normalizr';

const machineProcessStrategy = (value, parent, key) => {
	return { ...value, machine: parent.machineId };
};

const user = new schema.Entity('user');

const section = new schema.Entity(
	'sections',
	{},
	{
		idAttribute: 'sectionId'
	}
);

const disc = new schema.Entity(
	'discs',
	{},
	{
		idAttribute: 'discId'
	}
);

const rib = new schema.Entity('ribs', {}, { idAttribute: 'ribId' });
const inertia = new schema.Entity('inertias', {}, { idAttribute: 'inertiasId' });
const rollerbearing = new schema.Entity('rollerbearings', {}, { idAttribute: 'rollerBearingId' });
const foundation = new schema.Entity('foundations', {}, { idAttribute: 'foundationId' });
const abs = new schema.Entity('abs', {}, { idAttribute: 'absId' });

const rotation = new schema.Entity('rotations', {}, { idAttribute: 'rotationId' });
const journalbearing = new schema.Entity(
	'journalbearings',
	{ rotations: [rotation] },
	{ idAttribute: 'journalBearingId' }
);

const sheetmaterial = new schema.Entity('sheetmaterials',{},{ idAttribute: 'sheetMaterialId' });
const sheetrotation = new schema.Entity('sheetrotations',{},{ idAttribute: 'sheetRotationId' });
const sheettranslation = new schema.Entity('sheettranslations',{},{ idAttribute: 'sheetTranslationId' });
const sheet = new schema.Entity('sheet', {
		sheetmaterial: [sheetmaterial],
		sheetrotation: [sheetrotation],
		sheettranslation: [sheettranslation]
	},
	{
		idAttribute: 'sheetId'
	});
const vesrollerbearing = new schema.Entity('vesrollerbearings',{},{ idAttribute: 'vesRollerBearingId' });
const ves = new schema.Entity(
	'ves',
	{
		sheet: sheet,
		vesrollerbearings: [vesrollerbearing]
	},
	{ idAttribute: 'vesId' }
);

const machine = new schema.Entity(
	'machine',
	{
		sections: [section],
		ribs: [rib],
		discs: [disc],
		inertias: [inertia],
		rollerbearings: [rollerbearing],
		journalbearings: [journalbearing],
		foundations: [foundation],
		ves: [ves],
		abs: [abs]
	},
	{
		idAttribute: 'machineId'
	});

const campbell = new schema.Entity('resultcampbell',{},{ idAttribute: 'campbellId' });
const stiffness = new schema.Entity('resultstiffness',{},{ idAttribute: 'stiffnessId' });
const modes = new schema.Entity('resultmodes',{},{ idAttribute: 'modesId' });
const line = new schema.Entity('resultline',{},{ idAttribute: 'lineId' });

const settings = new schema.Entity(
	'projectsetting',
	{
		resultcampbell: [campbell],
		resultstiffness: [stiffness],
		resultmodes: [modes],
		resultline: [line]
	},
	{
		processStrategy: (value, parent, key) => {
			return { ...value, project: parent.projectId };
		}
	});

const project = new schema.Entity(
	'project',
	{
		machine: machine,
		projectsetting: settings,
		user: user
	},
	{
		idAttribute: 'projectId'
	});

export default [project];