select COUNT(st.id)
from solicitudes_tutoria st 
where st.estudiante_id ='4b0e660e-d7a4-44f2-9c63-94ddcc12a68e' 
and st.tutor_id ='5d18197a-0392-4218-9cf1-ba4da82598f7'


SELECT p.id as proyecto_id, p.estudiante_id, p.tutor_id, p.area, p.titulo
      FROM proyectos p 
      WHERE p.estado = 'en_progreso'

ALTER TABLE public.proyecto_tribunal
ADD COLUMN estudiante_id uuid NOT NULL,
ADD COLUMN created_at timestamp WITHOUT TIME ZONE NOT NULL DEFAULT now();

ALTER TABLE public.proyecto_tribunal
DROP CONSTRAINT proyecto_tribunal_rol_check;

select st.*, p.titulo, p.area, p.descripcion
from solicitudes_tutoria st 
inner join proyectos p on p.id = st.proyecto_id 
where st.tutor_id ='8894c2eb-3a68-4c0d-a353-07c3a014bb79'

select p.*, st.tipo_tutoria
from proyecto_tribunal pt 
inner join proyectos p on pt.proyecto_id =p.id
inner join solicitudes_tutoria st on p.id= st.proyecto_id


SELECT 
  pt.*,
  st.tipo_tutoria,
  json_agg(
    json_build_object(
      'id', ha.id,
      'accion', ha.accion,
      'fecha', ha.fecha,
      'detalle', ha.detalles
    )
  ) AS observacionesHistorial
FROM proyectos pt
INNER JOIN proyecto_tribunal pt2 ON pt.id = pt2.proyecto_id
INNER JOIN historial_acciones ha ON pt.id = ha.proyecto_id
inner join solicitudes_tutoria st on pt.id = st.proyecto_id
WHERE pt2.docentes_id = '5d18197a-0392-4218-9cf1-ba4da82598f7'
GROUP BY pt.id, st.tipo_tutoria

ALTER TABLE perfiles_proyecto
DROP CONSTRAINT perfiles_proyecto_estado_check;

ALTER TABLE perfiles_proyecto
ADD CONSTRAINT perfiles_proyecto_estado_check
CHECK (
  estado IN ('perfil_pendiente', 'perfil_observado', 'perfil_aprobado', 'perfil_en_revision')
);

ALTER TABLE borradores_proyecto
DROP CONSTRAINT IF EXISTS borradores_proyecto_estado_check;

ALTER TABLE borradores_proyecto
ADD CONSTRAINT borradores_proyecto_estado_check
CHECK (
  estado IN ('borrador_pendiente', 'borrador_observado', 'borrador_aprobado')
);


select *
from proyecto_tribunal pt 



SELECT 
pt.*,
json_agg(
  json_build_object(
    'id', ha.id,
    'accion', ha.accion,
    'fecha', ha.fecha,
    'detalle', ha.detalles,
    'tipo_tutoria', ha.tipo_tutoria,
    'corregido', ha.corregido
      )
       ORDER BY ha.fecha ASC
    ) AS observacionesHistorial
  FROM proyectos pt
  INNER JOIN proyecto_tribunal pt2 ON pt.id = pt2.proyecto_id
  INNER JOIN historial_acciones ha ON pt.id = ha.proyecto_id
  inner join borradores_proyecto p on pt.id = p.proyecto_id
  WHERE pt2.docentes_id = 'cc2594e0-4f0c-4b9f-87de-c6b4a981ce3e'
  AND ha.accion IN (
    'Aprobar Perfil',
    'Observación de borrador',
    'Aprobar borrador'
  )  
  GROUP BY pt.id
  
SELECT p.estudiante_id, p.titulo 
FROM borradores_proyecto b
inner join proyectos p on b.proyecto_id = p.id
WHERE b.proyecto_id = 'aa4db39a-e1cd-48b8-9748-0f3a3c9161ca'


SELECT p.estudiante_id, p.titulo
  FROM borradores_proyecto b
  inner join proyectos p on b.proyecto_id = p.id
  WHERE b.proyecto_id = 'aa4db39a-e1cd-48b8-9748-0f3a3c9161ca'
  group by p.estudiante_id, p.titulo


SELECT b.proyecto_id
FROM  borradores_proyecto b 
WHERE b.revisado_por = 'cc2594e0-4f0c-4b9f-87de-c6b4a981ce3e'



 SELECT 
    pt.*,
    json_agg(
      json_build_object(
        'id', ha.id,
        'accion', ha.accion,
        'fecha', ha.fecha,
        'detalle', ha.detalles,
        'tipo_tutoria', ha.tipo_tutoria,
        'corregido', ha.corregido
      )
    ) AS observacionesHistorial
  FROM proyectos pt
  INNER JOIN proyecto_tribunal pt2 ON pt.id = pt2.proyecto_id
  INNER JOIN historial_acciones ha ON pt.id = ha.proyecto_id
  inner join perfiles_proyecto p on pt.id = p.proyecto_id
  WHERE pt2.docentes_id = 'cc2594e0-4f0c-4b9f-87de-c6b4a981ce3e'
  GROUP BY pt.id;




