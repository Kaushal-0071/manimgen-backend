from manim import *
import os

class CDNExplanation(Scene):
    def construct(self):
        # 1. Handle OSError
        image_path = "server_image.png"
        if not os.path.exists(image_path):
            image_path = "https://raw.githubusercontent.com/mtreacy002/ManimCDN/main/assets/server_image.png"
        
        # 2. Mobject Instantiation: CDN Definition/Explanation
        cdn_definition = Text("CDN: Content Delivery Network", font_size=24)
        cdn_explanation1 = Text("Distributes content across multiple servers.", font_size=24)
        cdn_explanation2 = Text("Reduces latency and improves load times.", font_size=24)
        
        text_group = VGroup(cdn_definition, cdn_explanation1, cdn_explanation2).arrange(DOWN, aligned_edge=LEFT)
        
        # 3. Server Representation
        original_server = ImageMobject(image_path).scale(0.5).move_to(UP * 2 + LEFT * 5)
        europe_server = ImageMobject(image_path).scale(0.3).move_to(UP * 2 + RIGHT * 4)
        asia_server = ImageMobject(image_path).scale(0.3).move_to(DOWN * 2 + RIGHT * 4)
        north_america_server = ImageMobject(image_path).scale(0.3).move_to(DOWN * 2 + LEFT * 5)

        original_server_label = Text("Original Server", font_size=18).next_to(original_server, DOWN)
        europe_server_label = Text("Europe Server", font_size=14).next_to(europe_server, DOWN)
        asia_server_label = Text("Asia Server", font_size=14).next_to(asia_server, DOWN)
        north_america_server_label = Text("North America", font_size=14).next_to(north_america_server, DOWN)
        
        servers_group = VGroup(original_server, europe_server, asia_server, north_america_server,
                               original_server_label, europe_server_label, asia_server_label, north_america_server_label)
        
        # 4. User Request Animation
        user = Dot(color=BLUE).move_to(LEFT * 5 + DOWN * 3)
        user_label = Text("User", font_size=14).next_to(user, DOWN)
        request_arrow = Arrow(user.get_center(), original_server.get_center(), buff=0.5)
        request_label = Text("Request", font_size=14).move_to(LEFT * 2.5)
        
        # 5. CDN Distribution Animation
        dist_arrow1 = Arrow(original_server.get_center(), europe_server.get_center(), buff=0.5)
        dist_arrow2 = Arrow(original_server.get_center(), asia_server.get_center(), buff=0.5)
        dist_arrow3 = Arrow(original_server.get_center(), north_america_server.get_center(), buff=0.5)

        dist_label = Text("Content Distribution", font_size=14).move_to(UP*0.5+RIGHT*1)
        
        # 6. New User Request Animation
        new_user = Dot(color=GREEN).move_to(RIGHT * 4 + DOWN * 3)
        new_user_label = Text("New User", font_size=14).next_to(new_user, DOWN)
        new_request_arrow = Arrow(new_user.get_center(), asia_server.get_center(), buff=0.5) # Assuming Asia is nearest
        new_request_label = Text("Request (CDN)", font_size=14).move_to(RIGHT * 4)

        # 7. Animation Sequencing
        self.play(Write(cdn_definition))
        self.wait(1)
        self.play(FadeIn(cdn_explanation1, cdn_explanation2))
        self.wait(2)
        self.play(FadeOut(text_group))
        
        self.play(FadeIn(original_server, original_server_label))
        self.wait(0.5)
        self.play(Create(user), Write(user_label))
        self.wait(0.5)
        self.play(Create(request_arrow), Write(request_label))
        self.wait(1)
        self.play(FadeOut(user, user_label, request_arrow, request_label))

        self.play(FadeIn(europe_server, asia_server, north_america_server, europe_server_label, asia_server_label, north_america_server_label))
        self.wait(0.5)
        self.play(Create(dist_arrow1), Create(dist_arrow2), Create(dist_arrow3), Write(dist_label))
        self.wait(1)
        self.play(FadeOut(dist_arrow1, dist_arrow2, dist_arrow3, dist_label))
        
        self.play(Create(new_user), Write(new_user_label))
        self.wait(0.5)
        self.play(Create(new_request_arrow), Write(new_request_label))
        self.wait(1)
        
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        self.wait(1)