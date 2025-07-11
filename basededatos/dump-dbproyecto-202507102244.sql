PGDMP  )    ,        
        }         
   dbproyecto    17.4    17.4 >    X           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            Y           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            Z           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            [           1262    24941 
   dbproyecto    DATABASE        CREATE DATABASE dbproyecto WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Bolivia.1252';
    DROP DATABASE dbproyecto;
                     postgres    false                        3079    25382    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                        false            \           0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                             false    2            �            1259    25456    borradores_proyecto    TABLE     �  CREATE TABLE public.borradores_proyecto (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    proyecto_id uuid NOT NULL,
    documento text NOT NULL,
    estado character varying(20) NOT NULL,
    observaciones text,
    version character varying(20) NOT NULL,
    fecha_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_revision timestamp without time zone,
    revisado_por uuid
);
 '   DROP TABLE public.borradores_proyecto;
       public         heap r       postgres    false            �            1259    25592    defensas    TABLE     �  CREATE TABLE public.defensas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    proyecto_id uuid NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    lugar character varying(100) NOT NULL,
    estado character varying(20) DEFAULT 'programada'::character varying,
    nota_final numeric(5,2),
    acta text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    usuario_registro uuid NOT NULL,
    estudiante_id uuid NOT NULL,
    tribunal_1 uuid NOT NULL,
    tribunal_2 uuid NOT NULL,
    tribunal_3 uuid NOT NULL,
    tutor_id uuid,
    preguntas_correctas integer DEFAULT 0 NOT NULL,
    preguntas_incorrectas integer DEFAULT 0 NOT NULL,
    CONSTRAINT defensas_estado_check CHECK (((estado)::text = ANY (ARRAY[('programada'::character varying)::text, ('realizada'::character varying)::text, ('cancelada'::character varying)::text, ('aprobada'::character varying)::text, ('reprobada'::character varying)::text])))
);
    DROP TABLE public.defensas;
       public         heap r       postgres    false            �            1259    25563 
   documentos    TABLE     (  CREATE TABLE public.documentos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    solicitud_id uuid NOT NULL,
    estudiante_id uuid NOT NULL,
    proyecto_id uuid NOT NULL,
    nombre_archivo text,
    ruta_archivo text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.documentos;
       public         heap r       postgres    false            �            1259    25489    evaluaciones    TABLE     l  CREATE TABLE public.evaluaciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    proyecto_id uuid NOT NULL,
    evaluador_id uuid NOT NULL,
    tipo character varying(20) NOT NULL,
    criterio character varying(100) NOT NULL,
    puntuacion integer,
    comentarios text,
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT evaluaciones_puntuacion_check CHECK (((puntuacion >= 1) AND (puntuacion <= 10))),
    CONSTRAINT evaluaciones_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['perfil'::character varying, 'borrador'::character varying, 'defensa'::character varying])::text[])))
);
     DROP TABLE public.evaluaciones;
       public         heap r       postgres    false            �            1259    25516    historial_acciones    TABLE     3  CREATE TABLE public.historial_acciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid,
    proyecto_id uuid,
    accion text NOT NULL,
    detalles text,
    tipo_tutoria character varying(50),
    fecha timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    corregido boolean
);
 &   DROP TABLE public.historial_acciones;
       public         heap r       postgres    false            �            1259    25530    notificaciones    TABLE     ]  CREATE TABLE public.notificaciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    usuario_id uuid NOT NULL,
    mensaje text NOT NULL,
    tipo character varying(50) NOT NULL,
    leido boolean DEFAULT false,
    fecha_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    relacion_id uuid,
    relacion_tipo character varying(50),
    CONSTRAINT notificaciones_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['observacion'::character varying, 'aprobacion'::character varying, 'solicitud'::character varying, 'recordatorio'::character varying, 'general'::character varying])::text[])))
);
 "   DROP TABLE public.notificaciones;
       public         heap r       postgres    false            �            1259    25440    perfiles_proyecto    TABLE     �  CREATE TABLE public.perfiles_proyecto (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    proyecto_id uuid NOT NULL,
    documento text NOT NULL,
    estado character varying(20) NOT NULL,
    observaciones text,
    version integer DEFAULT 1,
    fecha_envio timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_revision timestamp without time zone,
    revisado_por uuid,
    CONSTRAINT perfiles_proyecto_estado_check CHECK (((estado)::text = ANY ((ARRAY['perfil_pendiente'::character varying, 'perfil_observado'::character varying, 'perfil_aprobado'::character varying, 'perfil_en_revision'::character varying])::text[])))
);
 %   DROP TABLE public.perfiles_proyecto;
       public         heap r       postgres    false            �            1259    25505    proyecto_tribunal    TABLE     �   CREATE TABLE public.proyecto_tribunal (
    proyecto_id uuid NOT NULL,
    docentes_id uuid NOT NULL,
    rol character varying(20),
    estudiante_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);
 %   DROP TABLE public.proyecto_tribunal;
       public         heap r       postgres    false            �            1259    25419 	   proyectos    TABLE     �  CREATE TABLE public.proyectos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    titulo character varying(255) NOT NULL,
    descripcion text,
    estudiante_id uuid NOT NULL,
    tutor_id uuid,
    estado character varying(20) NOT NULL,
    fecha_inicio timestamp without time zone NOT NULL,
    fecha_conclusion timestamp without time zone,
    fecha_defensa timestamp without time zone,
    nota_final numeric(5,2),
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    area character varying,
    hora_conclusion time without time zone,
    preguntas_correctas integer DEFAULT 0 NOT NULL,
    preguntas_incorrectas integer DEFAULT 0 NOT NULL,
    CONSTRAINT proyectos_estado_check CHECK (((estado)::text = ANY ((ARRAY['en_progreso'::character varying, 'perfil_pendiente'::character varying, 'perfil_observado'::character varying, 'perfil_aprobado'::character varying, 'borrador_pendiente'::character varying, 'borrador_observado'::character varying, 'borrador_aprobado'::character varying, 'listo_defensa'::character varying, 'concluido'::character varying, 'aprobado'::character varying, 'rechazado'::character varying])::text[])))
);
    DROP TABLE public.proyectos;
       public         heap r       postgres    false            �            1259    25430    solicitudes_tutoria    TABLE     �  CREATE TABLE public.solicitudes_tutoria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    estudiante_id uuid NOT NULL,
    tutor_id uuid NOT NULL,
    estado character varying(20) NOT NULL,
    fecha_solicitud timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta timestamp without time zone,
    tipo_tutoria character varying,
    detalle character varying,
    proyecto_id uuid,
    detalle_respuesta character varying,
    CONSTRAINT solicitudes_tutoria_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'aceptada'::character varying, 'rechazada'::character varying])::text[])))
);
 '   DROP TABLE public.solicitudes_tutoria;
       public         heap r       postgres    false            O          0    25456    borradores_proyecto 
   TABLE DATA                 public               postgres    false    221   X       U          0    25592    defensas 
   TABLE DATA                 public               postgres    false    227   Y       T          0    25563 
   documentos 
   TABLE DATA                 public               postgres    false    226   Y       P          0    25489    evaluaciones 
   TABLE DATA                 public               postgres    false    222   jZ       R          0    25516    historial_acciones 
   TABLE DATA                 public               postgres    false    224   �Z       S          0    25530    notificaciones 
   TABLE DATA                 public               postgres    false    225   k]       N          0    25440    perfiles_proyecto 
   TABLE DATA                 public               postgres    false    220   �]       Q          0    25505    proyecto_tribunal 
   TABLE DATA                 public               postgres    false    223   �^       L          0    25419 	   proyectos 
   TABLE DATA                 public               postgres    false    218   �_       M          0    25430    solicitudes_tutoria 
   TABLE DATA                 public               postgres    false    219   9a       �           2606    25465 ,   borradores_proyecto borradores_proyecto_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.borradores_proyecto
    ADD CONSTRAINT borradores_proyecto_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.borradores_proyecto DROP CONSTRAINT borradores_proyecto_pkey;
       public                 postgres    false    221            �           2606    25604    defensas defensas_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.defensas
    ADD CONSTRAINT defensas_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.defensas DROP CONSTRAINT defensas_pkey;
       public                 postgres    false    227            �           2606    25606 !   defensas defensas_proyecto_id_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.defensas
    ADD CONSTRAINT defensas_proyecto_id_key UNIQUE (proyecto_id);
 K   ALTER TABLE ONLY public.defensas DROP CONSTRAINT defensas_proyecto_id_key;
       public                 postgres    false    227            �           2606    25571    documentos documentos_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.documentos
    ADD CONSTRAINT documentos_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.documentos DROP CONSTRAINT documentos_pkey;
       public                 postgres    false    226            �           2606    25499    evaluaciones evaluaciones_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.evaluaciones DROP CONSTRAINT evaluaciones_pkey;
       public                 postgres    false    222            �           2606    25524 *   historial_acciones historial_acciones_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.historial_acciones
    ADD CONSTRAINT historial_acciones_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.historial_acciones DROP CONSTRAINT historial_acciones_pkey;
       public                 postgres    false    224            �           2606    25540 "   notificaciones notificaciones_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);
 L   ALTER TABLE ONLY public.notificaciones DROP CONSTRAINT notificaciones_pkey;
       public                 postgres    false    225            �           2606    25450 (   perfiles_proyecto perfiles_proyecto_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.perfiles_proyecto
    ADD CONSTRAINT perfiles_proyecto_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.perfiles_proyecto DROP CONSTRAINT perfiles_proyecto_pkey;
       public                 postgres    false    220            �           2606    25510 (   proyecto_tribunal proyecto_tribunal_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public.proyecto_tribunal
    ADD CONSTRAINT proyecto_tribunal_pkey PRIMARY KEY (proyecto_id, docentes_id);
 R   ALTER TABLE ONLY public.proyecto_tribunal DROP CONSTRAINT proyecto_tribunal_pkey;
       public                 postgres    false    223    223            �           2606    25429    proyectos proyectos_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.proyectos
    ADD CONSTRAINT proyectos_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.proyectos DROP CONSTRAINT proyectos_pkey;
       public                 postgres    false    218            �           2606    25439 B   solicitudes_tutoria solicitudes_tutoria_estudiante_id_tutor_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.solicitudes_tutoria
    ADD CONSTRAINT solicitudes_tutoria_estudiante_id_tutor_id_key UNIQUE (estudiante_id, tutor_id);
 l   ALTER TABLE ONLY public.solicitudes_tutoria DROP CONSTRAINT solicitudes_tutoria_estudiante_id_tutor_id_key;
       public                 postgres    false    219    219            �           2606    25437 ,   solicitudes_tutoria solicitudes_tutoria_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY public.solicitudes_tutoria
    ADD CONSTRAINT solicitudes_tutoria_pkey PRIMARY KEY (id);
 V   ALTER TABLE ONLY public.solicitudes_tutoria DROP CONSTRAINT solicitudes_tutoria_pkey;
       public                 postgres    false    219            �           1259    25551    idx_borradores_estado    INDEX     W   CREATE INDEX idx_borradores_estado ON public.borradores_proyecto USING btree (estado);
 )   DROP INDEX public.idx_borradores_estado;
       public                 postgres    false    221            �           1259    25550    idx_borradores_proyecto    INDEX     ^   CREATE INDEX idx_borradores_proyecto ON public.borradores_proyecto USING btree (proyecto_id);
 +   DROP INDEX public.idx_borradores_proyecto;
       public                 postgres    false    221            �           1259    25607    idx_defensas_fecha    INDEX     H   CREATE INDEX idx_defensas_fecha ON public.defensas USING btree (fecha);
 &   DROP INDEX public.idx_defensas_fecha;
       public                 postgres    false    227            �           1259    25608    idx_defensas_proyecto    INDEX     Q   CREATE INDEX idx_defensas_proyecto ON public.defensas USING btree (proyecto_id);
 )   DROP INDEX public.idx_defensas_proyecto;
       public                 postgres    false    227            �           1259    25554    idx_evaluaciones_proyecto    INDEX     Y   CREATE INDEX idx_evaluaciones_proyecto ON public.evaluaciones USING btree (proyecto_id);
 -   DROP INDEX public.idx_evaluaciones_proyecto;
       public                 postgres    false    222            �           1259    25555    idx_evaluaciones_tipo    INDEX     N   CREATE INDEX idx_evaluaciones_tipo ON public.evaluaciones USING btree (tipo);
 )   DROP INDEX public.idx_evaluaciones_tipo;
       public                 postgres    false    222            �           1259    25556    idx_historial_proyecto    INDEX     \   CREATE INDEX idx_historial_proyecto ON public.historial_acciones USING btree (proyecto_id);
 *   DROP INDEX public.idx_historial_proyecto;
       public                 postgres    false    224            �           1259    25557    idx_historial_usuario    INDEX     Z   CREATE INDEX idx_historial_usuario ON public.historial_acciones USING btree (usuario_id);
 )   DROP INDEX public.idx_historial_usuario;
       public                 postgres    false    224            �           1259    25559    idx_notificaciones_leido    INDEX     T   CREATE INDEX idx_notificaciones_leido ON public.notificaciones USING btree (leido);
 ,   DROP INDEX public.idx_notificaciones_leido;
       public                 postgres    false    225            �           1259    25558    idx_notificaciones_usuario    INDEX     [   CREATE INDEX idx_notificaciones_usuario ON public.notificaciones USING btree (usuario_id);
 .   DROP INDEX public.idx_notificaciones_usuario;
       public                 postgres    false    225            �           1259    25549    idx_perfiles_estado    INDEX     S   CREATE INDEX idx_perfiles_estado ON public.perfiles_proyecto USING btree (estado);
 '   DROP INDEX public.idx_perfiles_estado;
       public                 postgres    false    220            �           1259    25548    idx_perfiles_proyecto    INDEX     Z   CREATE INDEX idx_perfiles_proyecto ON public.perfiles_proyecto USING btree (proyecto_id);
 )   DROP INDEX public.idx_perfiles_proyecto;
       public                 postgres    false    220            �           1259    25543    idx_proyectos_estado    INDEX     L   CREATE INDEX idx_proyectos_estado ON public.proyectos USING btree (estado);
 (   DROP INDEX public.idx_proyectos_estado;
       public                 postgres    false    218            �           1259    25541    idx_proyectos_estudiante    INDEX     W   CREATE INDEX idx_proyectos_estudiante ON public.proyectos USING btree (estudiante_id);
 ,   DROP INDEX public.idx_proyectos_estudiante;
       public                 postgres    false    218            �           1259    25611    idx_proyectos_fecha    INDEX     Q   CREATE INDEX idx_proyectos_fecha ON public.proyectos USING btree (fecha_inicio);
 '   DROP INDEX public.idx_proyectos_fecha;
       public                 postgres    false    218            �           1259    25542    idx_proyectos_tutor    INDEX     M   CREATE INDEX idx_proyectos_tutor ON public.proyectos USING btree (tutor_id);
 '   DROP INDEX public.idx_proyectos_tutor;
       public                 postgres    false    218            �           1259    25547    idx_solicitudes_estado    INDEX     X   CREATE INDEX idx_solicitudes_estado ON public.solicitudes_tutoria USING btree (estado);
 *   DROP INDEX public.idx_solicitudes_estado;
       public                 postgres    false    219            �           1259    25545    idx_solicitudes_estudiante    INDEX     c   CREATE INDEX idx_solicitudes_estudiante ON public.solicitudes_tutoria USING btree (estudiante_id);
 .   DROP INDEX public.idx_solicitudes_estudiante;
       public                 postgres    false    219            �           1259    25546    idx_solicitudes_tutor    INDEX     Y   CREATE INDEX idx_solicitudes_tutor ON public.solicitudes_tutoria USING btree (tutor_id);
 )   DROP INDEX public.idx_solicitudes_tutor;
       public                 postgres    false    219            �           2606    25466 8   borradores_proyecto borradores_proyecto_proyecto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.borradores_proyecto
    ADD CONSTRAINT borradores_proyecto_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos(id);
 b   ALTER TABLE ONLY public.borradores_proyecto DROP CONSTRAINT borradores_proyecto_proyecto_id_fkey;
       public               postgres    false    4752    221    218            �           2606    25500 *   evaluaciones evaluaciones_proyecto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos(id);
 T   ALTER TABLE ONLY public.evaluaciones DROP CONSTRAINT evaluaciones_proyecto_id_fkey;
       public               postgres    false    218    222    4752            �           2606    25525 6   historial_acciones historial_acciones_proyecto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.historial_acciones
    ADD CONSTRAINT historial_acciones_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos(id);
 `   ALTER TABLE ONLY public.historial_acciones DROP CONSTRAINT historial_acciones_proyecto_id_fkey;
       public               postgres    false    218    224    4752            �           2606    25451 4   perfiles_proyecto perfiles_proyecto_proyecto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.perfiles_proyecto
    ADD CONSTRAINT perfiles_proyecto_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos(id);
 ^   ALTER TABLE ONLY public.perfiles_proyecto DROP CONSTRAINT perfiles_proyecto_proyecto_id_fkey;
       public               postgres    false    4752    218    220            �           2606    25511 4   proyecto_tribunal proyecto_tribunal_proyecto_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.proyecto_tribunal
    ADD CONSTRAINT proyecto_tribunal_proyecto_id_fkey FOREIGN KEY (proyecto_id) REFERENCES public.proyectos(id);
 ^   ALTER TABLE ONLY public.proyecto_tribunal DROP CONSTRAINT proyecto_tribunal_proyecto_id_fkey;
       public               postgres    false    218    4752    223            O   �   x��O=O�0��+nH\�c'�KU��C%T$ڲVg��"��20��,��)�������W�?~��ϥP�]r�9|����r��լ��\B�Q�� �8��#{6�K��h�t�������ER����Ts�c��`���B�	2�4Nտ��в�/�����Q�Th�$�F.�Ǽ�YO'��AaA赖kѯT���B�z�Y�N"��˫�D�0xM��������i� 1UXr      U   
   x���          T   =  x���1Oc1���m	W��8v�*!N�&$�8��ThE)���n����?��w�x��4��~M�sݿ������?���������b�VF�ܡ�9p(4�@C7�G'[_MkJ�B���V#h-�TL=�V�5t�0��ev<�%�qk�HE�/�n5Z��ހ�*Xf�0b�n(�eq�_��e����_�E���X&�>���NϘ�J��`*�9$�G)P� @6!m#o)mH��֗׫��J��!,�c��gy�v/�ģ'e��X�Ƒ��И?:��^;�0q?\��Ul��9���qK�	�)�Rj��њ��      P   
   x���          R   �  x�ŕ�j7����s�X[��C(�0���I�WaK�r��Ϝ�O ��>B^���i���il��\h�����Z����G??�O�=�-�C�~�u�_b)ô�E�x������qҥ@�$S�IZ唌�;�b���Ak��ql�"���J.j��72�Zy�>ҡ��lJ�]��9�l��4%�������O6�[�Ƈ;��w��xW�����P\b����p{���yzMe��ò��a9��N*/uZ� �֝RV+�ن�B��pt�uxl+���3�:4�ށ���>`V�r
�%KJڦ��95�(>[L
����4/4��2��c'*��hn�x�9ݟ-��W�����B�^Coug��� �D%��FZ�,��V&=XV��Y�6����ُ�<��0�qZĔ�ux�#Z�T޾iC�������ƿ[�%�h���w�,H�[߃�4܁d�ڂw(�'�O��c��lՐ�*(���}T�*x�e�+�W;���ޅ�ݞB_"#��Zg�D�A������X�-(<�#�Џ���b7�u`#�->��߈I�gZh��e�-�u������u���y�!Ub�MH���"1�&-�\�$���'	~����J�K�C��Eԁ��G���ҽN|u1��;k��80���8D��Ť�J����?p�#���^�(�p	㰽��I�sw�N�㒏�� i��7R��6�-�I>|� �^��t�@W��җ0X��X����	��      S   
   x���          N     x�}O�j�0��+���T�d[JC��%�&-�V�U1����B�����L�=;fv�������Ƌ�ZZ��b��t���t����u{����V�Y#t�0�H���(��)xi����&x�P�� ��V��X!�FMNՊp��m�����!p�3E'�M<�a~���;B?���a��/�����80��'�Ϙ`��R�δ�7ٮrB)�J�&�zU镮��U��QY9�yu�$�wQ�&���tVk.n��[a�      Q   �   x��ѱj1��=Oq۵Pɖ�V:u�()�i�"�l�&�d����ɦ��C����}�m����t��ޗ������}9���������s��=��<Z�J>+ �`�]h �����H�$+`� h�ش�%$)-�����<�E�Vp����!77���q���S�a��BZf!��|^l��!	��E A�ܠ�����Xs��G���yܧpE��l2y�X�c�B^c��� f�9��G�9      L   �  x���Mk�0���+t�:���d�=��²�n�kI�`�X��4��W��iz�� �w^�ǳ?��<���Ỹ��s�v����4�I<��O��6�N�.t�$0)[��Q%&�����*�S?��J"�臟<�4��Bm��j�%��˴~5Q�s�!7d��NCH!��SR�����}0Is�J]Ef ��IHR����xx��^F��������U>>�߿�Z�ַ��,����;�h���w*��N#��#k�|��BNdr�@�*e0>z�� ;$LA9�Vn���e��2�z���"�9�T1�0U}Zt�8z�Ȃ!�@t**ӥ�ጋ+�\�4�/!x�=8k0��~��2����L��X�O������S�V�]P^:�hӀ�B��T�ݡף�l~CC�      M   �  x���ˊ1E����v�@��Q��d��,Ɓxf��$���q;�X��v&C�B�u�Ruv����'�;<}�%^j�NC��d�N�2c%��u��x;��\�{`��� >x	�Zc|N1:�}���8z��$� Z��(,�Ď�Y}�L�#�0�dz�%CRa�����\�:���R� -hR>�O���}+�<�iu�=�9�o"��V)��!8� �!���*�kħ/��;�D�Ѡ�`ui������$��:`�Q���!;j�ZB�朒��
%�͔�?&�_&����?�&�m�;�q��iN��p�u�皇�������g�A�\XLL�G�X�r����x��l?l�ƨ��%��ǔ{E0Q%&���6� .$޸v��f�].��     